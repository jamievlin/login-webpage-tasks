#!/usr/bin/env python3
import srv.accountmgmt as am
import getpass
import ipaddress

TEST_USER = 'jamie'
TEST_PASSWORD = 'letmein'


def ev_loop(username: str):
    alive = True
    user_id = am.get_userid(username)
    print(f'userid: {user_id}')
    while alive:
        print('enter c to change password.')
        print('enter cs to clear all sessions')
        print('enter ns to create a new session')
        print('enter e to exit')
        inp = input('input: ')
        match inp:
            case 'c':
                new_pw = getpass.getpass()
                confirm_pw = getpass.getpass('Confirm password: ')
                if new_pw == confirm_pw:
                    am.change_password(username, new_pw)
                else:
                    print('Password does not match!')
            case 'ns':
                ret = am.create_session(
                    username,
                    ipaddress.IPv4Address('127.0.0.1'))
                if ret is None:
                    print('error!')
                    continue
                new_session, expiry = ret
                print(f'session token: 0x{new_session.hex()}')
                print(f'expiry: {expiry.isoformat()}')
            case 'cs':
                am.clear_all_session(username)
            case 'e':
                alive = False
                continue
            case '_':
                pass


def main():
    username = input('Username: ')
    password = getpass.getpass()
    if am.verify_login(username, password):
        print(f'Welcome home, {username}')
        ev_loop(username)
    else:
        print('Sorry, but we have trouble letting you in :(')


if __name__ == '__main__':
    main()
