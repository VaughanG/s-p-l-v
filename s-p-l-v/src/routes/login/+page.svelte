<script>
	import { enhance } from "$app/forms";
</script>

<div class="hero">
	<div class="hero-content flex-col lg:flex-row-reverse">
	  <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
		<div class="card-body">
		  <h2 class="card-title">Login</h2>
		  <form method="POST" use:enhance>
				<div class="form-control">
					<label class="label" for="username">
						<span class="label-text">Username</span>
					</label>
					<input type="text" id="username" name="username" class="input input-bordered" />
				</div>
				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text">Password</span>
					</label>
					<input type="password" id="password" name="password" class="input input-bordered" />
				</div>
				<div class="form-control mt-6">
					<input type="submit" value="Continue" class="btn btn-primary" />
				</div>
			</form>
		</div>
	  </div>
	</div>
</div>