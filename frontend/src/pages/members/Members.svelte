<script>
    import axios from "axios";

    let members = [];
    let loading = false;
    let error
    null;
    let amountOfComps = 0;

    async function getMembers() {
        try {

            loading = true;
            await axios.get("http://localhost:3001/api/mitglieder").then((response) => {
                members = response.data;
            });
        } catch (err) {
            error = err;
        } finally {
            loading = false;
        }

    }

    async function getSection(id) {
        try {
            loading = true;
            await axios.get("http://localhost:3001/api/sektion/" + id).then((response) => {
                return response.data;
            });
        } catch (err) {
            error = err;
        } finally {
            loading = false;
        }

    }

    //TODO MEmber as Modal
    function openLink() {
        window.open('#/addMember');
    }

    getMembers();
</script>

<div class="mb-5">
    <!--TODO Make nice-->

    <div class="row">
        <h1 class="col-11">List of all Members</h1>
        <button class="btn btn-primary button-round col-1" style="border-radius: 75%" on:click={openLink}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus"
                 viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
        </button>
    </div>
    {#if loading}
        <div style="display: grid; place-items: center;">
            <img src="images/loading.gif" alt="Loading..."/>
        </div>
    {:else if error}
        <div>An error occurred: {error.message}</div>
    {:else if members}
        <table class="table table-dark table-striped" style="margin-top: 12px;">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Geburtsdatum</th>
                <th>Geschlecht</th>
                <th>Sektion ID</th>
                <th>Edit</th>
            </tr>
            </thead>
            <tbody>
            {#each members as member}
                <tr>
                    <td>
                        {member.id}
                    </td>
                    <td>
                        {member.name}
                        {member.vorname}
                    </td>
                    <td>
                        {new Date(member.geburtsdatum).toLocaleDateString('de-CH', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}
                    </td>
                    <td>
                        {member.geschlecht}
                    </td>
                    <td>
                        {member.sektion_id}
                    </td>
                    <td>
                        <a href={"#/members/" + member.id}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                            </svg>
                        </a>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}
</div>
