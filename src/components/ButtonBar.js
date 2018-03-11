import React from 'react';
import { Grid, Col, Row, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

export function ButtonBar({onCreatePostClicked, buttonLabel, nextScreen, disabled}) {
    const buttonFactory = (label, screen) => {
        return withRouter(({history}) => (
            <Button
                bsSize="large" block
                bsStyle="primary"
                disabled={disabled}
                onClick={() => { onCreatePostClicked(screen).then(()=> history.push(screen)) }}>
                {label}
            </Button>
        ))
    };
    const RndPostButton = buttonFactory(buttonLabel, nextScreen);
    return (
        <Grid>
            <Row>
                <Col xs={12} md={12} className="button-bar">
                    <Col xsOffset={6} xs={6}>
                        <RndPostButton />
                    </Col>
                </Col>
            </Row>
        </Grid>
    );
}