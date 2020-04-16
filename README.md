# Hiveinvite

Website to claim and create Hive accounts and create invitations by link or email
https://hiveinvite.com

## Getting Started

These instructions will get you a copy of the project up and running on a fresh debian/ubuntu

### Prerequisites

Packages to install with apt

```
apt install git \
            sqlite3 \
            python3-iniparse \
            apache2
```

### Installing/Deployment

First, clone this repository into the webroot folder

```
cd /var/www
git clone https://github.com/pharesim/hiveinvite
```

Set up the database

```
cd hiveinvite
sqlite3 invites.sqlite3 < invites.db.txt
chown www-data:www-data invites.sqlite3
```

Set your configuration parameters (smtp server)

```
cd config
cp config.ini.default config.ini
nano config.ini
```

Configure the webserver (apache2 in this example)

```
cd /etc/apache2/sites-available/
cp 000-default.conf hiveinvite.conf
nano hiveinvite.conf
```

Minimal config example
```
<VirtualHost *:80>
        ServerName hiveinvite.localhost
        DocumentRoot /var/www/hiveinvite/public

        <Directory /var/www/hiveinvite/public/api>
          Options +ExecCGI
          SetHandler cgi-script
        </Directory>
</VirtualHost>

```

Finalize apache setup

```
a2enmod cgi
a2ensite hiveinvite
service apache2 restart
```

Load the site at http://hiveinvite.localhost

## Built With

* [steem-js](https://www.github.com/steemit/steem-js) - JS library for steem
* [i18next](https://github.com/i18next/i18next) - internationalization framework
* bootstrap (for layout and modals) and jquery (for bootstrap mainly), although those should be removed

## Contributing

Please submit pull requests for any contributions

## Authors

* **Pharesim** - *idea and initial work* - [pharesim.me](http://pharesim.me)

## License

This project is licensed under the GPL v3 - see the [LICENSE.md](LICENSE.md) file for details
