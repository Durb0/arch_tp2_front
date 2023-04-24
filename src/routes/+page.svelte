<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Service } from '../service';
	import { temp, status_chaudiere, plages_horaire, tr, error_chaudiere} from '../store';




	const service = new Service();


	let unsubscribetr:any;

	let formPlage = {
		debut: null,
		fin: null
	}
	

	let formTr = {
		temp_ref: $tr
	}
	

	onMount(async () => {
		console.log('onMount');
		requests();
		service.requestPlagesHoraire();
		service.requestTempRef();
		unsubscribetr = tr.subscribe((value) => {
			formTr.temp_ref = value;
		});
	});

	async function requests(){
		while(true){
			service.requestStatusChaudiere();
			service.requestTemp();
			service.requestErrorChaudiere();
			await new Promise(r => setTimeout(r, 1000));
		}
	}

	function createPlage(){
		if (formPlage.debut == null || formPlage.fin == null){
			return;
		}
		if(formPlage.debut > formPlage.fin){
			return;
		}
		service.addPlageHoraire(formPlage.debut, formPlage.fin);
	}

	function updateTempRef(){
		if (formTr.temp_ref == null){
			return;
		}
		service.updateTempRef(formTr.temp_ref);
	}

	function deletePlageHoraire(id:number){
		service.deletePlageHoraire(id);
	}

	//on destroy unsubscribe
	onDestroy(() => {
		console.log('onDestroy');
		unsubscribetr;
	});
</script>

<svelte:head>
	<title>INFO01</title>
	<meta name="description" content="Architecture tp2" />
</svelte:head>

<section>
	<div class="temp">
		{$temp}°C
	</div>
	<div class="voyants">
		<div class="voyant {$status_chaudiere ? 'voyant--on' : 'voyant--off'}">
			chaudiere
		</div>
		<div class="voyant {$error_chaudiere? 'voyant--error' : 'voyant--off'}">
			erreur
		</div>
	</div>
	<h2>Plages horraires</h2>
	<div class="plages_horaires">
		{#each $plages_horaire as plage}
			<div class="plage">
				<div class="label plage__debut">
					{plage.debut}
				</div>
				<div class="label plage__fin">
					{plage.fin}
				</div>
			</div>
			<button on:click={() => deletePlageHoraire(plage.id)}>delete</button>
			
		{/each}
	</div>
	<form on:submit|preventDefault={createPlage}>
		<input type="number" placeholder="debut" min="0" max="60" bind:value={formPlage.debut}/>
		<input type="number" placeholder="fin" min="0" max="60" bind:value={formPlage.fin} />
		<button type="submit">ajout</button>
	</form>
	<h2>Temperature de référence</h2>
	<form on:submit|preventDefault={updateTempRef}>
		<input type="number" placeholder="temp_ref" bind:value={formTr.temp_ref} min="5" max="35" />
		<button type="submit">set</button>
	</form>
	

	
</section>

<style lang="scss">

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: fit-content;
		margin: 0 auto;
		gap: 10px;
	}

	.temp{
		font-size: 50px;
	}


	.voyants {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: fit-content;
	}

	.voyant {
		text-align: center;
		border:1px solid black;
		padding: 5px;
		//width: fit-content;
		border-radius: 2px;
		color: white;

		&--on {
			border-color: green;
			background-color: green;
		}

		&--error {
			border-color: red;
			background-color: red;
		}

		&--off {
			border-color: grey;
			background-color: grey;
		}
	}

	.plage{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 5px;
		border: 2px solid darkgray;
		border-radius: 2px;
	}

	.plages_horaires{
		display: grid;
		grid-template-columns: 80% 20%;
		gap: 10px;
		width: 100%
	}

	.label{
		font-size: large;
		//bold
		font-weight: bold;
	}

	input{
		width: 50px;
	}
</style>
