# CFC_UI

######## Steps to create an android signed APK starts ###########

Step 1: Generating an upload key

- You can generate a private signing key using keytool. 

On Windows 
- keytool must be run from C:\Program Files\Java\jdkx.x.x_x\bin.
- Run: (Admin)
$ keytool -genkeypair -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
This command prompts you for passwords for the keystore and key and for the Distinguished Name fields for your key. It then generates the keystore as a file called my-upload-key.keystore.
Note – 
The keystore contains a single key, valid for 10000 days. The alias is a name that you will use later when signing your app, 
so remember to take note of the alias.

On Mac, 
- if you're not sure where your JDK bin folder is, then perform the following command to find it:
$ /usr/libexec/java_home
- It will output the directory of the JDK, which will look something like this:
/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home
- Navigate to that directory by using the command $ cd /your/jdk/path and use the keytool command with sudo permission as shown below.
$ sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

Note: Save this keystore file on some loaction of your system

Step 2: Go to healthAssistance directory folder and run

$ yarn build: android

? Choose the build type you would like: (Use arrow keys)
> apk - Build a package to deploy to the store or install directly on Android devices
  app-bundle - Build an optimized bundle for the store
  
-- Select apk

And complete one time build process (These question will not be asked again)

An Expo user account is required to proceed.
? How would you like to authenticate? (Use arrow keys)
> Make a new Expo account
  Log in with an existing Expo account
  Cancel
  
-- Select 'Make a new Expo account' if account does not existing

Thanks for signing up for Expo!
Just a few questions:

? E-mail: shubham.kaushik@aricent.com
? Username: healthAssistance
? Password: [hidden]
? Confirm Password: [hidden]

? Would you like to upload a keystore or have us generate one for you?
If you don't know what this means, let us handle it! :)

  1) Let Expo handle the process!
  2) I want to upload my own keystore!
  Answer: 2

Select option 2 here

? Would you like to upload a keystore or have us generate one for you?
If you don't know what this means, let us handle it! :)
 true
? Path to keystore: C:\Program Files (x86)\Java\jdk1.8.0_102\bin\my-upload-key.keystore
? Keystore Alias: my-key-alias
? Keystore Password: [hidden]
? Key Password: [hidden]

..... Build Started
......
........
......... After Build Completion

3. Run 'yarn status:android'

This will give you the path to apk file. Just run that path on browser, it will start downloading your apk.

############ Steps for an Android APK creation ends #############




  




