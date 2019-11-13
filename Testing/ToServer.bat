call npm run build
echo "copy"
xcopy *.css \\192.168.28.3\www\Magni\CanvasTable /y
xcopy *.ts \\192.168.28.3\www\Magni\CanvasTable /y
xcopy *.html \\192.168.28.3\www\Magni\CanvasTable /y
xcopy dist\* \\192.168.28.3\www\Magni\CanvasTable /e /y