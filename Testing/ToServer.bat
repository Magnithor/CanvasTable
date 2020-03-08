del docs /q /s
rmdir docs /s /q
call npm run typedoc
call npm run build
echo "copy"
scp -r *.css *.ts *.html *.php dist/dist docs magni@strumpur.net:/home/httpd/Magni/CanvasTable