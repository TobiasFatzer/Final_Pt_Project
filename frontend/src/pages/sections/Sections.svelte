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

    function deleteSectionWithNoMercy(id) {

        axios
            .delete("http://localhost:3001/api/sektion/" + id)
            .then((response) => {
                alert("Sektion deleted");
                closeModal();
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });

    }

    function deleteSection(id) {
        axios
            .get("http://localhost:3001/api/mitglieder/sektionId/" + id)
            .then((response) => {
                console.log(response.data)
                if (response.data.length > 0) {
                    openDeleteModal(id, response.data);
                } else {
                    axios
                        .delete("http://localhost:3001/api/sektion/" + id)
                        .then((response) => {
                            alert("Sektion deleted");
                        })
                        .catch((error) => {
                            console.log(error);
                            alert(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }


    //TODO Section as Modal
    function openLink() {
        window.open('#/addSection');
    }

    let deleteModalRef;
    let connectedMembers = []
    let sektionId;

    function openDeleteModal(id, members) {
        deleteModalRef.classList.add("show");
        deleteModalRef.setAttribute("aria-modal", true);
        deleteModalRef.style.display = "block";
        connectedMembers = members
        sektionId = id;
    }

    function closeModal() {
        deleteModalRef.classList.remove("show");
        deleteModalRef.removeAttribute("aria-modal");
        deleteModalRef.style.display = "none";
        connectedMembers = []
        sektionId = 0
    }


    getSections();


</script>
<div class="modal" tabindex="-1" role="dialog" bind:this={deleteModalRef}>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Verknüpfte Nutzer für Sektion {sektionId}</h5>
                <button type="button" on:click={closeModal} class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="mb-3 card-template">
                    {#each connectedMembers as member}
                        <div class="card">
                            <div class="card-body">
                                {member.id}
                                {member.vorname}
                                {member.name}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" on:click={closeModal} data-dismiss="modal">Close
                </button>
                <button type="button" class="btn btn-primary" on:click={deleteSectionWithNoMercy(sektionId)}>Trotzdem
                    Löschen
                </button>
            </div>
        </div>
    </div>
</div>

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
                        <a on:click={deleteSection(section.id)} class="btn" style="background-color: red;">Delete</a>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
