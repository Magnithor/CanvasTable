call npm run build
echo "copy"
xcopy index*.* \\192.168.28.3\www\Magni\CanvasTable /y
xcopy *.ts \\192.168.28.3\www\Magni\CanvasTable /y
xcopy dist\* \\192.168.28.3\www\Magni\CanvasTable /e /y