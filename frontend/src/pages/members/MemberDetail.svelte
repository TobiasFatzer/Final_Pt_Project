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

    let member = {
        id: "",
        nummer: "",
        name: "",
        vorname: "",
        geburtsdatum: "",
        geschlecht: "",
        sektion_id: "",
        comps: [],
    };

    function getMember() {
        axios.get("http://localhost:3001/api/mitglieder/" + id).then((response) => {
            member = response.data;
        });
    }

    function editMember() {
        axios
            .put("http://localhost:3001/api/mitglieder/" + id, member)
            .then((response) => {
                alert("Member edited");
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }

    function deleteMember() {
        axios
            .delete("http://localhost:3001/api/mitglieder/" + id, member)
            .then((response) => {
                alert("Member deleted");
                window.open("/member");
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }
</script>

<div class="mb-5">
    <h1 class="mt-3">Member (ID: {id})</h1>
    <div class="mb-3">
        <label for="" class="form-label">Vorname</label>
        <input class="form-control" type="text" bind:value={member.vorname}/>
    </div>
    <div class="mb-3">
        <label for="" class="form-label">Nachname</label>
        <input class="form-control" type="text" bind:value={member.name}/>
    </div>
    <div class="mb-3">
        <label for="" class="form-label">Geschlecht</label>
        <input class="form-control" type="text" bind:value={member.geschlecht}/>
    </div>
    <div class="mb-3">
        <label for="" class="form-label">Leistungsausweisnummer Militär</label>
        <input class="form-control" type="number" bind:value={member.nummer}/>
    </div>
    <div class="mb-3">
        <label for="" class="form-label">Geburtstag</label>
        <input
                class="form-control"
                type="text"
                bind:value={member.geburtsdatum}
        />
    </div>
    <button on:click={editMember} type="button" class="btn btn-primary">
        Edit Member
    </button>
    <button on:click={deleteMember} type="button" class="btn btn-primary">
        Delete Member
    </button>
</div>
