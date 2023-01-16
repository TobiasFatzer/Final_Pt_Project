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

    let Competition = {
        teilnehmer_ptr_id: "",
        steuermann_id: "",
        vorderfahrer_id: "",
        sektion_id: "",
        kategorie_id: "",
        steuermann_ist_ds: "",
        vorderfahrer_ist_ds: ""

    };
    let member = {
        id: "",
        nummer: "",
        name: "",
        vorname: "",
        geburtsdatum: "",
        geschlecht: "",
        sektion_id: "",
        comps: [Competition]
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
        }
        editMember();
        closeModal();
        location.reload();
    }


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
    <div class="card-template">
        <button type="button" class="btn btn-primary" on:click={openModal} data-toggle="modal"
                data-target="#modalRef">
            Neuer Wettkampf
        </button>
        <button style="width: 100%" on:click={editMember} type="button" class="btn btn-primary">
            Edit Member
        </button>
        <button on:click={deleteMember} type="button" class="btn btn-primary">
            Delete Member
        </button>

    </div>
</div>