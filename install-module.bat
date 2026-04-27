@echo off
setlocal
cls

:: Mengatur warna (0B = Hitam & Cyan Terang)
color 0B

echo.
echo  ======================================================
echo    PROJECT: STARTUP NODEJS TYPESCRIPT
echo    STATUS : INITIALIZING DEPENDENCIES
echo  ======================================================
echo.

echo  [STEP 1] Installing Production Library...
echo  ------------------------------------------------------
echo  ^> npm install dotenv
call npm install dotenv
echo.

echo  [STEP 2] Installing Development Tools...
echo  ------------------------------------------------------
echo  ^> @types/node, tsup, tsx, typescript
call npm install -D @types/node tsup tsx typescript
echo.

echo  ======================================================
echo    SUCCESS: ALL TOOLS INSTALLED CORRECTLY!
echo    HAPPY CODING!
echo  ======================================================
echo.

exit
