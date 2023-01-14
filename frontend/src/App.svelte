<script>
    import Router from "svelte-spa-router";
    import routes from "./routes";
</script>

<!-- This part is always displayed -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a href="#/">
            <img src="images/spsv_180.png" alt="SPSV Data" style="height: 2em; margin-right: 5px">
        </a>
        <a class="navbar-brand" href="#/"> SPSV Data</a>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="#/members">Members</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/sections">Sections</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<div class="container mt-3">
    <!-- Here we load the page depending on the current URL -->
    <Router {routes}/>
</div>

<style>
</style>
