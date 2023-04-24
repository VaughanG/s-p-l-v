<script>
	export let data;
</script>


<div class="hero">
	<div class="hero-content flex-col lg:flex-row-reverse">
	  <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
		<div class="card-body">
		  <h2 class="card-title">Profile</h2>
		  <table>
			<tr>
			  <td class="italic">Name:</td>
			  <td class="pl-2">{data.user.name}</td>
			</tr>
			<tr>
			  <td class="italic">Email:</td>
			  <td class="pl-2">{data.user.email}</td>
			</tr>
			<tr>
			  <td class="italic">Username:</td>
			  <td class="pl-2">{data.user.username}</td>
			</tr>
		  </table>
		</div>
	</div>
  </div>
</div>	