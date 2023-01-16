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

    let section_name = "";

    let section = {
        id: "",
        name: ""
    }

    let sections = [];

    function getSectionByName(name) {
        axios.get("http://localhost:3001/api/sektion/getSektionIdByName/" + name)
            .then((response) => {
                member.sektion_id = response.data.id
                console.log(member.sektion_id)
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }

    function addMember() {
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

    let editModalRef;
    let usedCompetition = {};

    function openModal(comp) {
        editModalRef.classList.add("show");
        editModalRef.setAttribute("aria-modal", true);
        editModalRef.style.display = "block";
        usedCompetition = comp;
        console.log(usedCompetition)
    }

    function closeModal() {
        editModalRef.classList.remove("show");
        editModalRef.removeAttribute("aria-modal");
        editModalRef.style.display = "none";
        console.log(usedCompetition)
        usedCompetition = {};
    }

    function saveComp() {
        if (usedCompetition.teilnehmer_ptr_id) {
            member.comps.findIndex((element, index) => {
                if (element.teilnehmer_ptr_id === usedCompetition.teilnehmer_ptr_id) {
                    member.comps[index] = usedCompetition;
                    console.log(`index of ${element} is ${index}`)
                }
            });
        } else {
            usedCompetition.teilnehmer_ptr_id = Math.round(Math.random() * 1000000 + 12)
            console.log(usedCompetition)
            member.comps.push(usedCompetition)
            member.comps = member.comps;
            console.log(member.comps)

        }
        closeModal();
    }


    getSections();
</script>
<div class="modal" tabindex="-1" role="dialog" bind:this={editModalRef}>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Wettkampf ID ({usedCompetition.teilnehmer_ptr_id})</h5>
                <button type="button" on:click={closeModal} class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="" class="form-label">Steuermann</label>
                    <input class="form-control" type="number" bind:value={usedCompetition.steuermann_id}/>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Vorderfahrer</label>
                    <input class="form-control" type="number" bind:value={usedCompetition.vorderfahrer_id}/>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Sektions ID</label>
                    <input class="form-control" type="number" bind:value={usedCompetition.sektion_id}/>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Kategorie ID</label>
                    <input class="form-control" type="number" bind:value={usedCompetition.kategorie_id}/>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Steuermann ist Doppelstarter</label>
                    <input class="form-control" type="text" bind:value={usedCompetition.steuermann_ist_ds}/>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Vorderfahrer ist Doppelstarter</label>
                    <input class="form-control" type="text" bind:value={usedCompetition.vorderfahrer_ist_ds}/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" on:click={closeModal} data-dismiss="modal">Close
                </button>
                <button type="button" class="btn btn-primary" on:click={saveComp}>Save changes</button>
            </div>
        </div>
    </div>
</div>

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
                <select class="form-select" bind:value={section_name} on:change={getSectionByName(section_name)}>
                    {#each sections as section}
                        <option>{section.name}</option>
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
        <label for="" class="form-label">Wettkämpfe</label>
        <div class="mb-3 card-template">
            {#each member.comps as comp}
                <div class="card">
                    <div class="card-body" on:click={openModal(comp)}>
                        {comp.teilnehmer_ptr_id}
                    </div>
                </div>
            {/each}
        </div>
        <button on:click={openModal} type="button" style="width: 100%; margin-bottom: 12px;" class="btn btn-primary">
            Add Wettkampf
        </button>
        <button on:click={addMember} type="button" class="btn btn-primary">
            Add Member
        </button>
    </form>
</div>
