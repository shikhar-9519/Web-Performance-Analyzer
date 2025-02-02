import axios from 'axios';

const CRUX_API_ENDPOINT = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';

export const fetchCruxData = async (url) => {
  try {
    const response = await axios.post(
      `${CRUX_API_ENDPOINT}?key=${process.env.REACT_APP_CRUX_API_KEY}`,
      {
        origin: url,
        formFactor: "ALL_FORM_FACTORS",
        metrics: [
          "cumulative_layout_shift",
          "first_contentful_paint",
          "largest_contentful_paint",
          "experimental_time_to_first_byte",
          "interaction_to_next_paint"
        ]
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch CrUX data: ${error.message}`);
  }
};

// Transform raw CrUX data into a more usable format
export const transformCruxData = (data) => {
  const metrics = data.record.metrics;
  
  return {
    url: data.record.key.origin,
    cls: metrics.cumulative_layout_shift?.percentiles?.p75 || 'N/A',
    fcp: metrics.first_contentful_paint?.percentiles?.p75 || 'N/A',
    lcp: metrics.largest_contentful_paint?.percentiles?.p75 || 'N/A',
    ttfb: metrics.experimental_time_to_first_byte?.percentiles?.p75 || 'N/A',
    inp: metrics.interaction_to_next_paint?.percentiles?.p75 || 'N/A'
  };
};