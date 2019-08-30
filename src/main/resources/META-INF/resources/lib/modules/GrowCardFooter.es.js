import React from "react";
import GrowIcon from "./GrowIcon.es";
import GrowTagList from "./GrowTagList.es";

class GrowCardFooter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="grow-card-footer">
        <div className="autofit-row autofit-padded">
          <div className="autofit-col autofit-col-expand">
            <GrowTagList articleTags={this.props.articleTags} />
          </div>

          <div className="autofit-col">
            <div className="autofit-section text-secondary">
              <GrowIcon
                spritemap={this.props.spritemap}
                classes="lexicon-icon inline-item inline-item-before"
                iconName="view"
              />
              <span>{this.props.articleReadCount}</span>
            </div>
          </div>
        </div>
        <div
          className={
            this.props.articleCategory.toLowerCase() + "-footer-inactive"
          }
        >
          <div className="autofit-row text-center">
            <div className="autofit-col autofit-col-expand">
              <div
                className={
                  this.props.articleCategory.toLowerCase() +
                  "-footer-active autofit-section"
                }
              >
                {(() => {
                  switch (this.props.articleCategory) {
                    case "Excellence":
                      return (
                        <GrowIcon
                          spritemap={this.props.spritemap}
                          classes="lexicon-icon inline-item inline-item-before"
                          iconName="sheets"
                        />
                      );
                    case "Learn":
                      return (
                        <GrowIcon
                          spritemap={this.props.spritemap}
                          classes="lexicon-icon inline-item inline-item-before"
                          iconName="info-book"
                        />
                      );
                    case "People":
                      return (
                        <GrowIcon
                          spritemap={this.props.spritemap}
                          classes="lexicon-icon inline-item inline-item-before"
                          iconName="user"
                        />
                      );
                    default:
                      return (
                        <GrowIcon
                          spritemap={this.props.spritemap}
                          classes="lexicon-icon inline-item inline-item-before"
                          iconName="share"
                        />
                      );
                  }
                })()}
                <span>{this.props.articleCategory}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GrowCardFooter;
