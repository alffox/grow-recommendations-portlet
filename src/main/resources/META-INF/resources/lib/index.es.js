import React from "react";
import ReactDOM from "react-dom";
import ReactResizeDetector from 'react-resize-detector';
import axios from 'axios';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';

import GrowCard from './modules/GrowCard.es';
import GrowIcon from "./modules/GrowIcon.es";

class App extends React.Component {
	
	constructor(props) {
        super(props);

		const GROUP_ID = Liferay.ThemeDisplay.getCompanyGroupId();
		const USER_ID = Liferay.ThemeDisplay.getUserId();
		this.PORTAL_URL = Liferay.ThemeDisplay.getPortalURL();

		this.SPRITEMAP = Liferay.ThemeDisplay.getPathThemeImages();

		this.ADD_TO_MYFAVOURITES_QUERY = this.PORTAL_URL + "/o/favourites/" + "/addFavourite?groupId=" + GROUP_ID + "&userId=" + USER_ID + "&assetEntryId=";
		this.REMOVE_FROM_MYFAVOURITES_QUERY = this.PORTAL_URL + "/o/favourites/" + "/removeFavourite?groupId=" + GROUP_ID + "&userId=" + USER_ID + "&assetEntryId=";
		this.GET_ISFAVOURITE_ARRAY = this.PORTAL_URL + "/o/favourites/isFavouriteArray?groupId="+ GROUP_ID + "&userId=" + USER_ID + "&assetEntryId=";

		this.ADD_ASSET_LIKE = this.PORTAL_URL + "/o/grow-likes/addAssetLike?userId=" + USER_ID + "&rank=1&assetEntryId=";
		this.REMOVE_ASSET_LIKE = this.PORTAL_URL + "/o/grow-likes/deleteAssetLike?&userId=" + USER_ID + "&assetEntryId=";
		this.GET_ISLIKED_ARRAY = this.PORTAL_URL + "/o/grow-likes/isAssetsLiked?userId=" + USER_ID + "&assetEntryId=";
		this.GET_ASSETS_LIKED_BY_USER = this.PORTAL_URL + "/o/grow-likes/getAssetsLikedByUserId?userId=" + USER_ID;

		this.GET_RECOMMENDATIONS_DEFAULT = this.PORTAL_URL + "/o/gsearch-rest/recommendations/en_US";
		this.GET_RECOMMENDATIONS_BY_LIKED = this.PORTAL_URL + "/o/gsearch-rest/recommendations/en_US?count=15&includeAssetTags=true&includeAssetCategories=true&includeUserPortrait=true&assetEntryId=";
		this.RECOMMENDATION_TOGGLE_STAR_EVENT = 'recommendationtoggleStarEvent';
		this.FAVOURITES_TOGGLE_STAR_EVENT = 'favouritesToggleStarEvent';

		this.state = {
			data: [],
			totalSlides: 1,
			visibleSlides: 1,
			isLoading: false,
			error: null
        };

		this.setVisibleSlides = this.setVisibleSlides.bind(this);
        this.onResize = this.onResize.bind(this);
		this.handleStarClick = this.handleStarClick.bind(this);
		this.handleLikeClick = this.handleLikeClick.bind(this);
		this.fireToggleStarEvent = this.fireToggleStarEvent.bind(this);
		this.toggleStar = this.toggleStar.bind(this);

		let instance = this; 
		
		Liferay.on(
			this.FAVOURITES_TOGGLE_STAR_EVENT,
			function(event) {
				if(event && event.data) {
					instance.toggleStar(event.data);
				}
			}
		);
    }
	
	toggleStar(data) {
		
		if (data) {
			this.setState({ isLoading: true });
		
			const newData = this.state.data.map(card =>
				card.id === data.id
				? Object.assign(card, {star: data.star})
				: card
			);
			
			this.setState({
				data: newData,
				isLoading: false
			});
		}
	}
	
	fireToggleStarEvent(data) {
		Liferay.fire(
			this.RECOMMENDATION_TOGGLE_STAR_EVENT,
			{
				data: data,
				isLoading: false
			}
		);
	}
	
	async handleStarClick(data) {

		if (data && !this.state.isLoading) {
			this.setState({ isLoading: true });
				
			let query = null;
			
			if (data.star) {
				query = this.ADD_TO_MYFAVOURITES_QUERY + data.id;
				
				await axios.put(query)
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
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				}
				else {
					query = this.REMOVE_FROM_MYFAVOURITES_QUERY + data.id;

					await axios.delete(query)
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
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				}
		}
	}

	async handleLikeClick(data) {
		if (data && !this.state.isLoading) {
			this.setState({ isLoading: true });
				
			let query = null;
			
			if (data.like) {
				query = this.ADD_ASSET_LIKE + data.id;
				
				await axios.post(query)
					.then(
						response => {
							const newData = this.state.data.map(card =>
								card.id === data.id
								? Object.assign(card, {like: data.like})
								: card
							);
														
							this.setState({
								data: newData,
								isLoading: false
							});
						}
					)
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				}
				else {
					query = this.REMOVE_ASSET_LIKE + data.id;

					await axios.post(query)
					.then(
						response => {
							const newData = this.state.data.map(card =>
								card.id === data.id
								? Object.assign(card, {like: data.like})
								: card
							);
														
							this.setState({
								data: newData,
								isLoading: false
							});
						}
					)
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				}
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
        if (width <= 680) {
            return this.setVisibleSlides(1);
        }
        else if (width <= 960) {
            return this.setVisibleSlides(2);
        }
        else {
            return this.setVisibleSlides(3);
        }
    }
	
	async componentDidMount() {
		this.setState({ isLoading: true });

		await axios.get(this.GET_ASSETS_LIKED_BY_USER)
		.then(response => {
			let api = this.GET_RECOMMENDATIONS_DEFAULT;
			if (response.data.data.length > 0) {
				let assetEntryIdArr = [];

				response.data.data.map(asset => {
					assetEntryIdArr.push(asset.id);
				})

				const assetEntryIdStr = assetEntryIdArr.join('&assetEntryId=');

				api = this.GET_RECOMMENDATIONS_BY_LIKED + assetEntryIdStr;
			}
			axios.get(api)
			.then(response => {
				this.setState({ 
					data: response.data.items,
					totalSlides: response.data.items.length
				})

				let assetEntryIdArr = [];
				response.data.items.map(asset => {
					assetEntryIdArr.push(asset.id);
				})

				const assetEntryIdStr = assetEntryIdArr.join('&assetEntryId=');

				axios.get(this.GET_ISFAVOURITE_ARRAY + assetEntryIdStr)
				.then(response => {
					let newData = [];
					for(var i = 0; i < response.data.length; i++) {
						newData.push(Object.assign({star: response.data[i]}, this.state.data[i]));
					}

					this.setState({
						data: newData
					})

					let assetEntryIdArr = [];
					this.state.data.map(asset => {
						assetEntryIdArr.push(asset.id);
					})

					const assetEntryIdStr = assetEntryIdArr.join('&assetEntryId=');

					axios.get(this.GET_ISLIKED_ARRAY + assetEntryIdStr)
					.then(response => {
						let newData = [];
						for(var i = 0; i < response.data.length; i++) {
							newData.push(Object.assign({like: response.data[i]}, this.state.data[i]));
						}

						this.setState({
							data: newData,
							isLoading: false
						})
					})
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					})
				})
				.catch(error => {
					this.setState({ error: error, isLoading: false });
					Liferay.Util.openToast(
						{
							message: error,
							title: Liferay.Language.get('error'),
							type: 'danger'
						}
					);
				})
			})
			.catch(error => {
				this.setState({ error: error, isLoading: false });
				Liferay.Util.openToast(
					{
						message: error,
						title: Liferay.Language.get('error'),
						type: 'danger'
					}
				);
			})
		})
		.catch(error => {
			this.setState({ error: error, isLoading: false });
			Liferay.Util.openToast(
				{
					message: error,
					title: Liferay.Language.get('error'),
					type: 'danger'
				}
			);
		});
	}

	render() {
		
		const {isLoading, error } = this.state;
		return (
			<div className="grow-recommendations-portlet">
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
								spritemap={this.SPRITEMAP}
								classes="lexicon-icon inline-item"
								iconName="angle-left"
							/>
						</ButtonBack>
						<Slider className={"grow-carousel-slider"}>
							{this.state.data.map((cardData, key) => 
								<Slide index={key} key={key}>
									<GrowCard
										spritemap={this.SPRITEMAP}
										portalUrl={this.PORTAL_URL}
										cardData={cardData}
										handleStarClick={this.handleStarClick}
										handleLikeClick={this.handleLikeClick}
										articleAuthor={cardData.articleAuthor}
										articleAuthorAvatar={cardData.authorAvatar}
										articleCreateDate={cardData.createDate}
										articleTitle={cardData.articleTitle}
										articleContent={cardData.articleContent}
										articleTags={cardData.tags}
										articleReadCount={cardData.readCount}
										articleCategory={cardData.articleCategory}
										like={cardData.like ? cardData.like : false}
										star={cardData.star ? cardData.star : false}
										id={cardData.id}
									/>
								</Slide>
							)}
						</Slider>		
						<ButtonNext
							className={"carousel-button-next"}>
							<GrowIcon
								spritemap={this.SPRITEMAP}
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