#!/usr/bin/env python3
import srv.accountmgmt as am
import getpass

TEST_USER = 'jamie'
TEST_PASSWORD = 'letmein'


def ev_loop(username: str):
    alive = True
    while alive:
        print('enter c to change password.')
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
