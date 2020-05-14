# Savior19

## Setting up

```



```


## Running the Django Project

```bash

# To make migrations :
$ python manage.py makemigrations

# To migrate to the database :
$ python manage.py migrate

# To run the application :
$ python manage.py runserver

```

## Additional Details

<ul>
    <li>There are two branches in this repository, (master and deploy). The 'deploy' branch has a pipeline straight from github to heroku to get it deployed automatically. All the changes from the developers side wil be done to the master branch and when we want to deploy it, we should merge the 'master' branch to the 'deploy' branch</li>
    <li>In our 'settings.py' file there is an option of 'DEPLOY', this is by default set to 'True' in the deploy branch and 'False' in the master branch. When this is set to 'True', the settings are changed to suit for deployment.</li>
    <li>If we need to deploy the project with 'DEBUG' as 'False' in our local environment then we should first execute 'python manage.py collectstatic' and then run the server. While executing this command django will load all the static files into the 'staticfiles' directory for it to load during deployment.</li>
</ul>

## Heroku Deployment

```bash

# To login :
$ heroku login

# To view list of all available apps :
$ heroku apps

# To Run any Django command :
$ heroku run <Django Command> -a <Heroku application name>
"""Eg:"""  $ heroku run python manage.py createsuperuser -a savior19-staging

```