import React from "react";
import ReactDOM from "react-dom";
import ReactResizeDetector from 'react-resize-detector';
import axios from 'axios';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';

import GrowCard from './modules/GrowCard.es';
import GrowIcon from "./modules/GrowIcon.es";

const SPRITEMAP = Liferay.ThemeDisplay.getPathThemeImages();

const API = 'https://jsonplaceholder.typicode.com';
const DEFAULT_QUERY = '/todos/1';
const REMOVE_FROM_MYFAVOURITES_QUERY = '/todos/1';
const ADD_TO_MYFAVOURITES_QUERY = '/todos/1';

const RECOMMENDATION_TOGGLE_STAR_EVENT = 'recommendationtoggleStarEvent';
const FAVOURITES_TOGGLE_STAR_EVENT = 'favouritesToggleStarEvent';

const mockupData = {
    "data": [
        {
            "articleAuthor": "Gábor Ambrózy",
            "authorAvatar": "/o/GrowRecommendationsPortlet/images/0.jpeg",
            "createDate": "01.01.2019",
            "articleTitle": "Title 01 My Faavourite",
            "articleContent":
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
            "tags": ["badge", "gamification", "respect", "test1", "test2"],            
            "readCount": "626",
            "articleCategory": "Learn",
			id: "card-001",
			star: true,
			like: true
        },
        {
            "articleAuthor": "Gábor Ambrózy",
            "authorAvatar": "/o/GrowRecommendationsPortlet/images/0.jpeg",
            "createDate": "01.01.2019",
            "articleTitle": "Respected badge",
            "articleContent":
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
            "tags": ["badge", "gamification", "respect", "test1", "test2"],            
            "readCount": "626",
            "articleCategory": "Excellence",
			id: "card-9999",
			star: false,
			like: false
        },
        {
            "articleAuthor": "Gábor Ambrózy",
            "authorAvatar": "/o/GrowRecommendationsPortlet/images/0.jpeg",
            "createDate": "01.01.2019",
            "articleTitle": "Badge of Respect",
            "articleContent":
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
            "tags": ["badge", "gamification", "respect", "test1", "test2"],            
            "readCount": "626",
            "articleCategory": "People",
			id: "card-103",
			star: false,
			like: false
        },
        {
            "articleAuthor": "Gábor Ambrózy",
            "authorAvatar": "/o/GrowRecommendationsPortlet/images/0.jpeg",
            "createDate": "01.01.2019",
            "articleTitle": "RB",
            "articleContent":
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
            "tags": ["badge", "gamification", "respect", "test1", "test2"],            
            "readCount": "626",
            "articleCategory": "Share",
			id: "card-104",
			star: false,
			like: false
        },
        {
            "articleAuthor": "Gábor Ambrózy",
            "authorAvatar": "/o/GrowRecommendationsPortlet/images/0.jpeg",
            "createDate": "01.01.2019",
            "articleTitle": "RB-5",
            "articleContent":
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
            "tags": ["badge", "gamification", "respect", "test1", "test2"],            
            "readCount": "626",
            "articleCategory": "Share",
			id: "card-105",
			star: false,
			like: false
        }
    ]
}

class App extends React.Component {
	
	constructor(props) {
        super(props);

		this.state = {
			data: [],
			totalSlides: 1,
			visibleSlides: 1,
			isLoading: false,
			error: null
        };
		
		let instance = this; 
		
		Liferay.on(
			FAVOURITES_TOGGLE_STAR_EVENT,
			function(event) {
				if(event && event.data) {
					instance.toggleStar(event.data);
				}
			}
		);
		
		this.setVisibleSlides = this.setVisibleSlides.bind(this);
        this.onResize = this.onResize.bind(this);
		this.handleStarClick = this.handleStarClick.bind(this);
		this.fireToggleStarEvent = this.fireToggleStarEvent.bind(this);
		this.toggleStar = this.toggleStar.bind(this);
    }
	
	toggleStar(data) {
		
		if (data) {
			this.setState({ isLoading: true });
		
			setTimeout(() => {
					const newData = this.state.data.map(card =>
						card.id === data.id
						? Object.assign(card, {star: data.star})
						: card
					);
					
					this.setState({
						data: newData,
						isLoading: false
					});
			}, 500);
		}
	}
	
	fireToggleStarEvent(data) {
		Liferay.fire(
			RECOMMENDATION_TOGGLE_STAR_EVENT,
			{
				data: data
			}
		);
	}
	
	handleStarClick(data) {
			
		if (data) {
			this.setState({ isLoading: true });
			
			setTimeout(() => {	
				
				let query = null;
				
				if (data.star) {
					query = ADD_TO_MYFAVOURITES_QUERY;
				} else {
					query = REMOVE_FROM_MYFAVOURITES_QUERY;
				}
					
				axios.get(API + query)
					.then(
						response => {
							const newData = this.state.data.map(card =>
								card.id === data.id
								? Object.assign(card, {star: data.star})
								: card
							);
														
							this.setState({
								data: newData,
								isLoading: false
							});
		
							this.fireToggleStarEvent(data);
						}
					)
					.catch(function(error) {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				
			}, 500);
			
		}
		
	}

    setVisibleSlides(visibleSlides) {
        if (visibleSlides != this.state.visibleSlides) {
            this.setState({
                visibleSlides: visibleSlides,
                isLoading: false
            });
        }
    }
    
    onResize(width) {
        if (width <= 640) {
            return this.setVisibleSlides(1);
        }
        else if (width <= 960) {
            return this.setVisibleSlides(2);
        }
        else {
            return this.setVisibleSlides(3);
        }
    }
	
	componentDidMount() {
		this.setState({ isLoading: true });

		setTimeout(() => {
		axios.get(API + DEFAULT_QUERY)
			.then(
				response => {
					this.setState({ 
						data: mockupData.data,
						totalSlides: mockupData.data.length,
						isLoading: false })
				}
			)
			.catch(function(error) {
				this.setState({ error: error, isLoading: false });
				Liferay.Util.openToast(
					{
						message: error,
						title: Liferay.Language.get('error'),
						type: 'danger'
					}
				);
			});
			
		}, 500);
	}

	render() {
		
		const {isLoading, error } = this.state;
		
		return (
			<div className="grow-recommendations-porltet">
				<div className="container">
				
					{isLoading && (
						<div className="loading-indicator">
							<span aria-hidden="true" className="loading-animation"></span>
						</div>
					)}
				
					<ReactResizeDetector handleWidth onResize={this.onResize} />
					
					<CarouselProvider
						className={"grow-recommendations-carousel"}
						naturalSlideWidth={350}
						naturalSlideHeight={300}
						totalSlides={this.state.totalSlides}
						visibleSlides={this.state.visibleSlides}
					>
						<ButtonBack
							className={"carousel-button-back"}>
							<GrowIcon
								spritemap={SPRITEMAP}
								classes="lexicon-icon inline-item"
								iconName="angle-left"
							/>
						</ButtonBack>
						<Slider>
							{this.state.data.map((cardData, key) => 
								<Slide index={key} key={key}>
									<GrowCard
										spritemap={SPRITEMAP}
										cardData={cardData}
										handleStarClick={this.handleStarClick}
										articleAuthor={cardData.articleAuthor}
										articleAuthorAvatar={cardData.authorAvatar}
										articleCreateDate={cardData.createDate}
										articleTitle={cardData.articleTitle}
										articleContent={cardData.articleContent}
										articleTags={cardData.tags}
										articleReadCount={cardData.readCount}
										articleCategory={cardData.articleCategory}
										like={cardData.like}
										star={cardData.star}
										id={cardData.id}
									/>
								</Slide>
							)}
						</Slider>		
						<ButtonNext
							className={"carousel-button-next"}>
							<GrowIcon
								spritemap={SPRITEMAP}
								classes="lexicon-icon inline-item"
								iconName="angle-right"
							/>
						</ButtonNext>
					</CarouselProvider>
				</div>
			</div>
		);
	}
}

export default function(elementId) {
	ReactDOM.render(<App />, document.getElementById(elementId));
}