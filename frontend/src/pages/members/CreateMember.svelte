<script>
    import axios from "axios";

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
    let section = {
        name: ""
    }

    let sections = [];

    function addMember() {
        member.sektion_id = section.name
        axios.post("http://localhost:3001/api/mitglieder", member)
            .then((response) => {
                window.location.assign('#/members');
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }

    function getSections() {
        try {
            axios.get("http://localhost:3001/api/sektion").then((response) => {
                sections = response.data;
            });
        } catch (err) {
            console.log(err);
        }
    }

    function addSection() {
        axios
            .post("http://localhost:3001/api/sektion", section)
            .then((response) => {
                getSections();
                section.name = "";
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }


    getSections();
</script>

<div class="mb-5">
    <h1 class="mt-3">Add a Member</h1>
    <form>
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
        <div class="row">
            <div class="mb-3 col-6">
                <label for="" class="form-label">Sektionen</label>
                <select class="form-select">
                    {#each sections as section}
                        <option value="{section.id}">{section.name}</option>
                    {/each}
                </select>
            </div>
            <div class="mb-3 col-4">
                <label for="" class="form-label">Neue Sektionen</label>
                <input class="form-control" type="text" bind:value={section.name}/>
            </div>
            <div class="mb-3 col-2">
                <input style="margin-top: 32px; width:100%" type="button" on:click={addSection}
                       value="Sektion hinzufügen" class="btn btn-primary"/>
            </div>
        </div>
        <button on:click={addMember} type="button" class="btn btn-primary">
            Add Member
        </button>
    </form>
</div>
