<?php
	session_start();
	if (isset($_SESSION['LOGGED']) && $_SESSION['LOGGED']){			//if logged 
		header('Location: home.php');
		exit();
	}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>VetManager</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="Stylesheet" type="text/css" href="css/style.css" />
</head>
<body>
    <nav id="menu">
        <div id="appTitle">
            <a href="index.php">VetManager</a>
        </div>
        <div id="appAuthButtons">
            <a href="login.php" class="btn btnLogin">Login</a>
            <a href="register.php" class="btn btnRegister">Register</a>
        </div>
        <div class="clear"></div>
    </nav>

    <div id="content">
        <div id="contentTitle">
            <h1>Welcome to VetManager!</h1>
        </div>
        <div id="contentDescription">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, 
            saepe placeat quas asperiores nam laudantium tenetur commodi accusamus, 
            nisi deserunt nemo aut eveniet quis quod totam quae praesentium officia 
            earum neque delectus aspernatur cum. Rem hic aliquid, repellendus praesentium 
            assumenda debitis commodi repudiandae quas, porro eum quia, maxime iste! Pariatur.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, 
            saepe placeat quas asperiores nam laudantium tenetur commodi accusamus, 
            nisi deserunt nemo aut eveniet quis quod totam quae praesentium officia 
            earum neque delectus aspernatur cum. Rem hic aliquid, repellendus praesentium 
            assumenda debitis commodi repudiandae quas, porro eum quia, maxime iste! Pariatur.
        </div>
        <div id="contentFunctions">
            <div class="functionItem">
                <div class="functionItemImage">
                    <img src="https://via.placeholder.com/300x150/ddd/000000" alt="">
                </div>
                <div class="functionItemDescription">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate nostrum 
                    officiis, exercitationem asperiores laboriosam corrupti atque tempora animi. Quis, officia!</p>
                </div>
                <div class="clear"></div>
            </div>
            <div class="functionItem">
                <div class="functionItemImage">
                    <img src="https://via.placeholder.com/300x150/333/fff" alt="">
                </div>
                <div class="functionItemDescription">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate nostrum 
                    officiis, exercitationem asperiores laboriosam corrupti atque tempora animi. Quis, officia!</p>
                </div>
                <div class="clear"></div>
            </div>
            <div class="functionItem">
                <div class="functionItemImage">
                    <img src="https://via.placeholder.com/300x150/ffffff/000000" alt="">
                </div>
                <div class="functionItemDescription">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate nostrum 
                    officiis, exercitationem asperiores laboriosam corrupti atque tempora animi. Quis, officia!</p>
                </div>
                <div class="clear"></div>
            </div>
        </div>
    </div>

</body>
</html>