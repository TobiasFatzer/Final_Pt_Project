<script>
    import axios from "axios";

    let sections = [];
    let loading = false;
    let error = null;

    async function getSections() {
        try {
            loading = true;
            await axios.get("http://localhost:3001/api/sektion").then((response) => {
                sections = response.data;
            });
        } catch (err) {
            error = err;
        } finally {
            loading = false;
        }
    }

    //TODO Section as Modal
    function openLink() {
        window.open('#/addSection');
    }

    getSections();
</script>

<div class="mb-5">
    <!--TODO Make nice-->
    <div class="row" style="margin-bottom: 12px;">
        <h1 class="col-11">List of all Sections</h1>
        <button class="btn btn-primary button-round col-1" style="border-radius: 75%" on:click={openLink}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus"
                 viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
        </button>
    </div>
    {#if loading}
        <div>Loading...</div>
    {:else if error}
        <div>An error occurred: {error.message}</div>
    {:else if sections}
        <div class="card-template">
            {#each sections as section}
                <div class="card" style="flex: 1;">
                    <div class="card-body">
                        <h5 class="card-title">{section.name}</h5>
                        <p class="card-text">{section.id}</p>
                        <a href={"#/sections/" + section.id} class="btn btn-primary">Edit</a>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
