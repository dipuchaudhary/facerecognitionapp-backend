const clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: "9b9af68598514ccd8bb7e886d96ae376",
});

const handleApiCall = (req,res) => {
      app.models.predict(
			Clarifai.FACE_DETECT_MODEL,req.body.input)
			.then(data => {
				res.json(data);
			})
		.catch(error => res.status(400).json('unable to call api'))	
}


const handleImage = (req,res,db) => {
    const { id } = req.body;
    db('users').where({id})
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(error => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
};