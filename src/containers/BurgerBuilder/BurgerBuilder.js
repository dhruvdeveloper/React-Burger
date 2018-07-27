import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axiosInstance from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../Store/actions/index';
import { connect } from 'react-redux';

export class BurgerBuilder extends Component {
    state = {
        purchasing: false,
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, elm) => {
                return sum + elm;
            }, 0);
        
        return sum > 0;
    }

    purchaseHandler = () => {
        if(this.props.isAuthenticated) {
            this.setState({ purchasing: true });
        }else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseClickHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert("Let's continue");
        this.props.onInitPurchase();
        this.props.history.push("/checkout");
    }

    render() {
        const disabledInfo = {
            ...this.props.ing
        }
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummery = null;

        let burger = this.props.error ? <p> Ingredients cant be loaded. </p> : <Spinner />

        if (this.props.ing) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ing} />
                    <BuildControls addIngredient={this.props.onIngredientAdded} removeIngredient={this.props.onIngredientRemoved} disabled={disabledInfo} price={this.props.price} purchasable={this.updatePurchaseState(this.props.ing)} ordered={this.purchaseHandler} isAuth={this.props.isAuthenticated} />
                </Aux>
            );
            orderSummery = <OrderSummary ingredients={this.props.ing} purchaseCanceled={this.purchaseClickHandler} purchaseContinued={this.purchaseContinueHandler} price={this.props.price} />;
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} clicked={this.purchaseClickHandler}>
                    {orderSummery}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ing: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axiosInstance));