# CanvasTable
CanvasTable is Typescript library who draws a table on canvas.

If you like to use offscreenCanvas and/or keep the data in webworker then you use **mthb-offscreen-canvas-table** on main javascript and **mthb-offscreen-canvas-table-worker** in weworker they will work to geather
  

| npm | remarks |
| ---- | -------- |
| mthb-canvas-table | draw on gui thread |
| mthb-offscreen-canvas-table | connect canvas and events to webworker |
| mthb-offscreen-canvas-table-worker | draw on webworker |

[Demo](http://magni.strumpur.net/CanvasTable)

#TODO
* send event on click on data CanvasTable
* send event on click on hader CanvasTable
* send event on click on data CanvasTableWorker
* send event on click on hader CanvasTableWorker
* resize column

#Supported
* web worker
* multi col sort
* custom sort
* mulit group
* over row
* sepra grid
* custom render data
* custom drawing col
* auto scroll X and Y
* draw sort arrow on header 
* sort when click on header
