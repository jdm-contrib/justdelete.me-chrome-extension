# JustDelete.me Chrome Extension

Provides link on a site to where to delete account and informs you how hard it is to delete your account.

Information about how to delete account is pulled daily from JustDelete.me ([justdelete.me](http://justdelete.me/)). 

This extension will add a traffic light icon to your omnibar indicating the difficulty in removing an account on the website your visiting is. 

Upon clicking this icon you will be taken to the page which you can delete your account.

## Colour Key:
* Green - Simple process
* Yellow - Some extra steps involved
* Red - Cannot be fully deleted without contacting customer-services
* Black - Cannot be deleted

## Contributing

If you'd like to help this extension by adding a few lines of code, fork https://github.com/jdm-contrib/justdelete.me-chrome-extension and send a pull request.

## Releasing

Firstly tag the release in GitHub by running `git tag VERSION_NUMBER && git push origin --tags`. Then run `bash release.sh`, this'll will create a zip file of the latest version of the extension, which can be uploaded to the chrome store.
