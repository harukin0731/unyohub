"""Container operations. Backup/restore require web, app and scheduler stopped."""
import os
from pathlib import Path
import shutil
import socket
import sqlite3
import subprocess
import sys
import tarfile
from datetime import datetime

ROOT = Path('/var/www/unyohub')
STATE = ('config', 'data', 'libs_data', 'common_dbs')


def cli(*args):
    subprocess.run([str(ROOT / 'commands/unyohub'), *args], check=True)


def check_databases():
    for directory, name in [('libs_data', 'wakarana.db'), ('libs_data', 'zizai_captcha.db'),
                            ('common_dbs', 'announcements.db'), ('common_dbs', 'moderation.db')]:
        path = ROOT / directory / name
        if not path.is_file():
            raise RuntimeError('Run tools init before starting services')
        with sqlite3.connect(f'file:{path}?mode=ro', uri=True) as db:
            if not db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchone():
                raise RuntimeError(f'Database is not initialized: {path}')


def healthy():
    check_databases()
    with socket.create_connection(('127.0.0.1', 9000), timeout=2):
        pass


def init(user):
    if not user.isascii() or not user.replace('_', '').isalnum():
        raise ValueError('Admin ID must contain ASCII letters, numbers or underscores')
    if not (ROOT / 'libs_data/wakarana.db').exists():
        cli('setup-libs', user)
    else:
        print('Existing user database retained; administrator creation skipped')
    cli('init-common-dbs')
    for name in STATE:
        for path in (ROOT / name).rglob('*'):
            if not path.is_symlink():
                path.chmod(0o750 if path.is_dir() else 0o640)
    check_databases()
    print('Initialization completed')


def backup():
    target = Path('/backups') / datetime.now().strftime('unyohub-%Y%m%d-%H%M%S-%f.tar.gz')
    with tarfile.open(target, 'w:gz') as archive:
        for name in STATE:
            archive.add(ROOT / name, arcname=name)
    target.chmod(0o600)
    print(target)


def restore(filename):
    source = Path('/backups') / filename
    if source.parent != Path('/backups'):
        raise ValueError('Specify a backup filename without directories')
    with tarfile.open(source, 'r:gz') as archive:
        members = archive.getmembers()
        for member in members:
            parts = Path(member.name).parts
            if (not parts or parts[0] not in STATE or '..' in parts
                    or Path(member.name).is_absolute() or not (member.isfile() or member.isdir())):
                raise ValueError(f'Unsafe archive entry: {member.name}')
        if not all(any(m.name == name for m in members) for name in STATE):
            raise ValueError('Backup does not contain all state directories')
        if any((ROOT / name).is_symlink() for name in STATE):
            raise ValueError('State directory must not be a symlink')
        for name in STATE:
            for path in (ROOT / name).iterdir():
                if path.is_dir() and not path.is_symlink():
                    shutil.rmtree(path)
                else:
                    path.unlink()
        # All members were validated before removing any existing state.
        # Extract explicitly to support Python 3.11 without tar extraction filters.
        for member in members:
            destination = ROOT / member.name
            if member.isdir():
                destination.mkdir(parents=True, exist_ok=True)
                destination.chmod(0o750)
            else:
                destination.parent.mkdir(parents=True, exist_ok=True)
                with archive.extractfile(member) as source_file, destination.open('wb') as target:
                    shutil.copyfileobj(source_file, target)
                destination.chmod(0o640)
    print('Restored', source.name)


def import_data(name):
    if Path(name).name != name or name in ('.', '..'):
        raise ValueError('Specify one railroad directory name')
    source = Path('/imports') / name
    if not source.is_dir():
        raise ValueError('Railroad directory is missing from imports/')
    if any(p.is_symlink() for p in source.rglob('*')):
        raise ValueError('Import must not contain symbolic links')
    target = ROOT / 'data' / name
    if target.exists():
        raise ValueError('Railroad directory already exists; use CLI for updates')
    shutil.copytree(source, target)
    for path in target.rglob('*'):
        path.chmod(0o750 if path.is_dir() else 0o640)
    target.chmod(0o750)
    cli('init-db', name)
    cli('embed-icons', name)
    cli('conv-formations', name)
    print('Import complete. Import operations using update-operations, then enable railroad in admin UI.')


if __name__ == '__main__':
    os.chdir(ROOT)
    args = sys.argv[1:]
    try:
        if args == ['health']:
            healthy()
        elif len(args) == 2 and args[0] == 'init':
            init(args[1])
        elif args == ['backup']:
            backup()
        elif len(args) == 3 and args[0] == 'restore' and args[2] == '--replace':
            restore(args[1])
        elif len(args) == 2 and args[0] == 'import':
            import_data(args[1])
        elif args and args[0] == 'cli':
            cli(*args[1:])
        elif args == ['help']:
            print('Commands: init ADMIN_ID | import RAILROAD | cli ARGS... | backup | restore FILE --replace')
            print('Stop web, app and scheduler before backup/restore. Restore replaces all state.')
        else:
            raise ValueError('Invalid command; use help')
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
