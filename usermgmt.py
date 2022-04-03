#!/usr/bin/env python3
import click
import srv.accountmgmt as am


@click.group()
def main():
    pass


@click.command()
@click.option('--username', prompt='username')
def get_userid(username: str):
    userid = am.get_userid(username)
    if userid is None:
        print('user does not exist!')
        return
    print(f'userid: {userid}')


@click.command()
@click.option('--session', '-s', 'session_hex', prompt='session')
def verify_session(session_hex: str):
    new_hex_str = session_hex[2:] \
        if session_hex.startswith('0x') \
        else session_hex
    ret = am.verify_session(bytes.fromhex(new_hex_str))
    if ret is None:
        print('session does not exist!')
        return
    username, expiry = ret
    print(f'Session belongs to {username}')
    print(f'Expiry: {expiry.isoformat()}')


main.add_command(get_userid)
main.add_command(verify_session)

if __name__ == '__main__':
    main()
