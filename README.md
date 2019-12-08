# CanvasTable

### Main classes
<ul>
    <li>{@link CanvasTable}</li>
    <li>{@link OffscreenCanvasTable}</li>
    <li>{@link OffscreenCanvasTableWorker}</li>
</ul>

<hr/>


CanvasTable is Typescript library who draws a table on canvas. It is very fast to draw table and it will not slow down if data is big

If you like to use offscreenCanvas and/or keep the data in webworker then you use **mthb-offscreen-canvas-table** on main javascript and **mthb-offscreen-canvas-table-worker** in weworker they will work to geather


| npm | remarks |
| ---- | -------- |
| mthb-canvas-table | draw on gui thread |
| mthb-offscreen-canvas-table | connect canvas and events to webworker |
| mthb-offscreen-canvas-table-worker | draw on webworker |

[Demo website where you can see component in action with table with 23.000 records](https://magni.strumpur.net/CanvasTable)
# TODO
* Edit with commit and rollback

# Supported
* web worker
* multi col sort
* custom sort
* mulit group
* over row
* sepra grid
* custom render data
* custom drawing col
* custom style for row and cal
* auto scroll X and Y
* draw sort arrow on header 
* sort when click on header
