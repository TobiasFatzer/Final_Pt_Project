<script>
    import axios from "axios";

    export let params = {};

    let id;

    $: {
        // "Reactive Statement":
        // This block of is executed whenever the value of a variable in it changes.
        // See https://svelte.dev/tutorial/reactive-statements
        id = params.id;
        getMember();
    }

    let section = {
        id: "",
        name: "",
        nummer: ""
    };

    function getMember() {
        axios.get("http://localhost:3001/api/sektion/" + id).then((response) => {
            section = response.data;
        });
    }

    function editSection() {
        axios
            .put("http://localhost:3001/api/sektion/" + id, section)
            .then((response) => {
                alert("Sektion edited");
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }

    function deleteSection() {
        axios
            .delete("http://localhost:3001/api/sektion/" + id, section)
            .then((response) => {
                alert("Sektion deleted");
                window.open("#/sections");
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }
</script>

<div class="mb-5">
    <h1 class="mt-3">Section (ID: {id})</h1>
    <div class="mb-3">
        <label for="" class="form-label">Name</label>
        <input class="form-control" type="text" bind:value={section.name}/>
    </div>

    <button on:click={editSection} type="button" class="btn btn-primary">
        Edit Section
    </button>
    <button on:click={deleteSection} type="button" class="btn btn-primary">
        Delete Section
    </button>
</div>
