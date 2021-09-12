@echo off
call npm run build:ssg
git init
git add --all
git commit -m "initial"
git push -f https://github.com/beans42/chem-calc.git master
rm -rf .git