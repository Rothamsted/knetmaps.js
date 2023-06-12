set -e
echo Cleaning
rm -Rf node_modules package-lock.json
npm cache clean --force

echo Reinstalling
npm install
printf "\n\nDone. Proceed with 'gulp optimise'.\n"
