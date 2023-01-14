<script>
    import axios from "axios";

    let section = {
        id: "",
        name: "",
        nummer: "",
    };

    function addSection() {
        axios
            .post("http://localhost:3001/api/sektion", section)
            .then((response) => {
                alert("Sektion added");
                window.location.assign("#/sections");
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }

</script>

<div class="mb-5">
    <h1 class="mt-3">Add a Sektion</h1>

    <form>
        <div class="mb-3">
            <label for="" class="form-label">Name</label>
            <input class="form-control" type="text" bind:value={section.name}/>
        </div>
        <button on:click={addSection} type="button" class="btn btn-primary floater">
            Save
        </button>
    </form>
</div>