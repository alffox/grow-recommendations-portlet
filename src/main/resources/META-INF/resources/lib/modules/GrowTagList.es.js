import React from "react";

class GrowTagList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.articleTags) {
      return (
        <div className="autofit-section grow-card-tag">
          {this.props.articleTags
            .slice(0, this.props.numOfDisplayed)
            .map((tag, index) => {
              return (
                <span
                  key={index}
                  className="label label-secondary text-uppercase"
                >
                  <span className="label-item label-item-expand">{tag}</span>
                </span>
              );
            })}
          {this.props.articleTags.length > this.props.numOfDisplayed && (
            <span
              className="label label-secondary text-uppercase"
              data-toggle="tooltip"
              data-placement="right"
              title={this.props.articleTags.slice(
                this.props.numOfDisplayed,
                this.props.articleTags.length
              )}
            >
              <span className="label-item label-item-expand">
                + {this.props.articleTags.length - this.props.numOfDisplayed}
              </span>
            </span>
          )}
        </div>
      );
    } else {
      return <div className="autofit-section grow-card-tag"></div>;
    }
  }
}

GrowTagList.defaultProps = {
  numOfDisplayed: 3
};

export default GrowTagList;
