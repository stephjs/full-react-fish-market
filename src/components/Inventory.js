import React from "react";
import AddFishForm from "./AddFishForm";
import base from "../base";


class Inventory extends React.Component {
	constructor() {
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);
		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount() {
		base.onAuth((user) => {
			this.authHandler(null, {user});
		});
	}
	handleChange(e, key) {
		const fish = this.props.fishes[key];
		//console.log(fish);
		const updatedFish = {...fish,
			[e.target.name]: e.target.value
		};
		this.props.updateFish(key, updatedFish);
	}

	authenticate(provider) {
		console.log("logging in....", provider);
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	logout() {
		base.unauth(); // firebase logout
		this.setState({
			uid: null
		})
	}

	authHandler(err, authData) {
		console.log(authData);
		if (err) {
			console.error(err);
			return;
		}

		const storeRef = base.database().ref(this.props.storeId);
		storeRef.once("value", (snapshot) => {
			const data = snapshot.val() || {};		

			if (!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				})
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			})
		})
	}
	renderInventory(key) {
		const fish = this.props.fishes[key];
		return(
			<div className="fish-edit" key={key}>
				<input type="text" name="name" placeholder="Fish Name" value={fish.name} onChange={(e)=>this.handleChange(e, key)}/>
				<input type="text" name="price" placeholder="Fish Price" value={fish.price} onChange={(e)=>this.handleChange(e, key)}/>
				<select  name="status" value={fish.satus} onChange={(e)=>this.handleChange(e, key)}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea type="text" name="desc" placeholder="Fish Description" value={fish.desc} onChange={(e)=>this.handleChange(e, key)}></textarea>
				<input type="text" name="image" placeholder="Fish Image" value={fish.image} onChange={(e)=>this.handleChange(e, key)}/>
				<button onClick={()=>this.props.removeFish(key)}>Remove Fish</button>
			</div>
		);
	}

	renderLogin() {
		return(
			<nav className="login">
		        <h2>Inventory</h2>
		        <p>Sign in to manage your store's inventory</p>
		        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
		        <button className="facebook" onClick={() => this.authenticate('facebook')} >Log In with Facebook</button>
		     </nav>
		);
	}
	render() {
		const logout = <button onClick={this.logout}>Log Out!</button>;

		// check if the user is or is not logged in
		if (!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}

		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you don't own this store</p>
					{logout}
				</div>
			);
		}
		return (
			<div className="Inventory">
				{logout}
				<h1 className="title">Inventory</h1>
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSamples}>Load Sample Fish</button>
			</div>
		);

	}
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	updateFish: React.PropTypes.func.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	storeId: React.PropTypes.string.isRequired
}

export default Inventory;