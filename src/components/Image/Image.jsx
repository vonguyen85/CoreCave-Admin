/* eslint-disable react/react-in-jsx-scope */
import FILETYPE from "consts/fileType";
import PropTypes from "prop-types";

Image.propTypes = {
    src: PropTypes.string,
    type: PropTypes.string,
    alt: PropTypes.string
}

function Image({ src, type, alt = "", ...props }) {

    switch (type) {
        case FILETYPE.IMAGE:
            return <div className="table_thumnail"><img src={src} alt={alt} {...props} /></div>
        case FILETYPE.VIDEO:
            return <div className="table_thumnail"><video width="100%" src={src} alt={alt} controls={true} {...props} /></div>
        case FILETYPE.AUDIO:
            return <div className="table_thumnail"><audio controls style={{ width: "100%" }} {...props} >  <source src={src} type="audio/mpeg" /></audio></div>
        default:
            return "Other";
    }
}

export default Image;