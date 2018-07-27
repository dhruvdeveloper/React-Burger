import React from 'react';
import BuildControl from './BuildControl/BuildControl';

import classes from './BuildControls.css';

const controls = [
    {label: 'Salad', type:'salad'},
    {label: 'Cheese', type:'cheese'},
    {label: 'Bacon', type:'bacon'},
    {label: 'Meat', type:'meat'}
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl key={ctrl.label} label={ctrl.label} addedIngredient={() => props.addIngredient(ctrl.type)} removedIngredient={() => props.removeIngredient(ctrl.type)} disabled={props.disabled[ctrl.type]}/>            
        ))}
        <button className={classes.OrderButton} disabled={!props.purchasable} onClick={props.ordered}>{props.isAuth ? 'ORDER NOW' : 'SIGNUP TO CONTINUE'}</button>
    </div>
);

export default buildControls;