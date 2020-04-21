import React from "react";
import withWidth from '@material-ui/core/withWidth';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  masonry: {
  	display: "flex",
  	flexDirection: "row",
  	justifyContent: "center",
  	alignContent: "stretch",
  	width: "100%",
  	margin: "auto",
  },
  column: {
    width: '100%',
    margin: '6px'
  }
}));

function MasonryGrid(props){
	const classes = useStyles();
	const [columns, setColumns] = React.useState(1);
	const breakpoints = ["xs","sm","md","lg","xl"]

	React.useEffect(() => {
		// Setting number of columns based on MUI breakpoint widths
		// Each breakpoint up increments number of columns
		setColumns(breakpoints.indexOf(props.width)+1)
	}, [props.width, breakpoints]);

	function mapChildren(){
		// Don't fully understand
		// Somehow mapping children into an array to be displayed as a grid
		let col = [];
		const numC = columns;
		for (let i = 0; i < numC; i++){
			col.push([])
		}
		return props.children.reduce((p,c,i) => {
					p[i%numC].push(c);
					return p;
				}, col);
	}

	return(
		<div className={classes.masonry}>
			{mapChildren().map((col, ci) => {
				return (
					<div className={classes.column} key={ci} >
						{col.map((child, i) => {
							return <div key={i} >{child}</div>
						})}
					</div>
				)
			})}
		</div>
	)
}

export default withWidth()(MasonryGrid)
