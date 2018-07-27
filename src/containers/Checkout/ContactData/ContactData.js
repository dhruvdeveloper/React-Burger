import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../Store/actions/index';

import axiosInstance from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

class ContactData extends Component {
    state = {
        orderForm : {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZipCode'
                },
                value: '',
                validation: {
                    required: true,
                    minimum: 5,
                    maximum: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                validation: {},
                value: 'fastest',
                valid: true
            }
        },
        formValidate: false
    }

    checkValidity (value, rules) {
        let isValid = true;

        if(!rules) {
            return true;
        }
        
        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.maximum) {
            isValid = value.length <= rules.minimum && isValid;
        }
        if(rules.minimum) {
            isValid = value.length >= rules.maximum && isValid;
        }
        return isValid;
    }

    inputChangedHandler = (event, id) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedOrderElement = {
            ...updatedOrderForm[id]
        };
        updatedOrderElement.value = event.target.value;
        updatedOrderElement.valid = this.checkValidity(updatedOrderElement.value, updatedOrderElement.validation);
        updatedOrderElement.touched = true;

        let formValidate = true;
        for(let key in updatedOrderForm) {
            formValidate = updatedOrderForm[key].valid && formValidate;
        }
        updatedOrderForm[id] = updatedOrderElement;
        this.setState({ orderForm: updatedOrderForm, formValidate: formValidate })
    }

    orderHandle = (event) => {
        event.preventDefault();

        this.setState({
            loading: true
        });

        const formData = {};
        for(let formDataId in this.state.orderForm) {
            formData[formDataId] = this.state.orderForm[formDataId].value;
        }

        const orders = {
            ingredients: this.props.ing,
            totalPrice: this.props.price,
            userData: formData,
            userId: this.props.userId
        }

        this.props.onOrderBurger(orders, this.props.token);

    }

    render() {
        const formElementArray = [];
        for(let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandle}>
                {formElementArray.map(formElement => {
                    return <Input key={formElement.id} elementType={formElement.config.elementType} elementConfig={formElement.config.elementConfig} value={formElement.config.value} changed={(event) => this.inputChangedHandler(event, formElement.id)} invalid={!formElement.config.valid} shouldValidate={formElement.config.validation} touched={formElement.config.touched}/>
                })}
                <Button btnType="Success" disabled={!this.state.formValidate}>ORDER NOW</Button>
            </form>
        );
        if(this.props.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact information</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ing: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axiosInstance));