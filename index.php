<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Okiagari</title>

    <script src="./libs/stats.min.js"></script>
    <script src="./libs/three.js"></script>
    <script src="./libs/TrackballControls.js"></script>
    <script src="./myLibs/UtilWindow.js"></script>
    <script src="./src/Main.js"></script>
    <script src="./src/KoboshiObject.js"></script>
    <script src="./src/KoboshiShikakeObject.js"></script>




    <style>
        *{
            margin: 0;
        }
        #stats{
            position: absolute;
        }
        #main{
            position: absolute;
        }
    </style>
</head>
<body>
<div id="main"></div>
<div id="stats"></div>


<script>
    window.onload = function ()
    {
        new Main(Main.MODE_INTERACT);
    };
</script>

</body>
</html>


