import React from 'react';
import PropTypes from 'prop-types';

const SearchResult = ({ value, desc, rxValue, onClick }) => {
    console.log(`Rendering SearchResult - value: ${value}, desc: ${desc}, rxValue: ${rxValue}`);

    return (
        <div className="search-result" onClick={onClick} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', margin: '5px', borderRadius: '5px' }}>
            <h3>{value}</h3>
            <p className="description">{desc}</p>
            <p><strong>Rx Value:</strong> {rxValue}</p>
        </div>
    );
};

SearchResult.propTypes = {
    value: PropTypes.string.isRequired,
    desc: PropTypes.string,
    rxValue: PropTypes.string,
    onClick: PropTypes.func
};

SearchResult.defaultProps = {
    desc: 'Description not available',
    rxValue: 'N/A',
    onClick: () => {}
};

export default SearchResult;
