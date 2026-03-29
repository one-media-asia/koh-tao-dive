

       if (req.method !== 'POST') {
	       res.status(405).json({ error: 'Method not allowed' });
	       return;
       }

       try {
	       const {
		       name,
		       email,
		       phone,
		       preferred_date,
		       experience_level,
		       message,
		       item_title,
		       deposit_amount,
		       payment_choice,
		       paypal_link,
	       } = req.body || {};

		       const formData = {
			       access_key: 'a237fd7a-99eb-4905-89f4-c25ede3abf8c',
		       subject: `New Booking Inquiry: ${item_title}`,
		       name,
		       email,
		       phone,
		       preferred_date,
		       experience_level,
		       message,
		       item_title,
		       deposit_amount,
		       payment_choice,
		       paypal_link,
	       };

			   const response = await fetch('https://api.web3forms.com/submit', {
					   method: 'POST',
					   headers: { 'Content-Type': 'application/json' },
					   body: JSON.stringify(formData),
			   });

			   let data;
			   let rawText = '';
			   try {
				   rawText = await response.text();
				   data = JSON.parse(rawText);
			   } catch (parseErr) {
				   console.error('Web3Forms non-JSON response:', rawText);
				   res.status(500).json({ error: 'Web3Forms API returned non-JSON response', details: rawText });
				   return;
			   }

			   if (data.success) {
				   res.status(200).json({ success: true });
			   } else {
				   res.status(500).json({ error: data.message || 'Web3Forms submission failed', details: data });
			   }
       } catch (err) {
	       console.error('send-booking-notification error', err);
	       res.status(500).json({ error: err.message || 'Internal error' });
       }
}
