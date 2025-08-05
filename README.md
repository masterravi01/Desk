# MyAng

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Start app in local

To run electron app run below command in root directory

1. npm run start
2. npm run electron OR Run debugger attach with Main

## Word to pdf convert

Need to download libre office software in the system
Window OS - https://www.libreoffice.org/donate/dl/win-x86_64/25.2.1/en-US/LibreOffice_25.2.1_Win_x86-64.msi

# 🚀 Release Build Steps

## 1. Draft a New Release on GitHub

- Visit: [https://github.com/masterravi01/Desk/releases](https://github.com/masterravi01/Desk/releases)
- Click on **"Draft a new release"**
- Set the **tag** and **release title** to the next version from `package.json`
  - Example:
    - If current version is `"version": "1.3.2"`, then set **1.3.3**
- Click **Publish release**

---

## 2. Update Local Project Version and Create Package

- Open `package.json` and update the version field:
  ```json
  "version": "1.3.3"
  Run the packaging script:
  ```

bash
Copy
Edit
npm run package
This will create a new folder called release-builds/

3. Rename Generated Files
   In the release-builds/ folder:

Rename the following files:

nginx
Copy
Edit
Alfa Setup 1.3.3.exe → Alfa-Setup-1.3.3.exe
Alfa Setup 1.3.3.exe.blockmap → Alfa-Setup-1.3.3.exe.blockmap
⚠️ Make sure to replace spaces (" ") with dashes ("-") in the filenames.

4. Upload Files to GitHub Release
   Visit: https://github.com/masterravi01/Desk/releases/edit/1.3.3

Upload the renamed files from release-builds/

❌ Do NOT upload the win-unpacked folder

Click Update release

✅ Result
Users on client machines will now see a notification:

"New update is available"
