import { load } from "https://deno.land/std@0.201.0/dotenv/mod.ts";
import { Video } from "../types.ts";

const { DATA_API_KEY, BASE_URI } = await load({ export: true });

const DATA_SOURCE = "OmegaCluster";
const DATABASE = "cinespace";
const COLLECTION = "videos";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apiKey: DATA_API_KEY,
  },
  body: "",
};

// !updateVideo

const updateVideo = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body();
    const {
      thumbnailPublic,
      dislikeCount,
      viewsCount,
      isKids,
      desc,
      videoPublic,
      comments,
    }: Video = await body.value;
    const URI = `${BASE_URI}/updateOne`;

    const set: Video = {};
    if (thumbnailPublic) set.thumbnailPublic = thumbnailPublic;
    if (videoPublic) set.videoPublic = videoPublic;
    else if (dislikeCount) set.dislikeCount = dislikeCount;
    else if (viewsCount) set.viewsCount = viewsCount;
    else if (isKids) set.isKids = isKids;
    else if (desc) set.desc = desc;
    else if (comments) set.comments = comments;

    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: {
        videoPublic: params.id,
      },
      update: { $set: set },
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const videoUpdated = await dataResponse.json();
    response.headers.set("Access-Control-Allow-Origin", "*");

    response.status = 200;
    response.body = {
      success: true,
      videoUpdated,
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// !addVideo
const addVideo = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const { thumbnailPublic, isKids, uploadedBy, title, desc, videoPublic } =
        await request.body().value;
      const video: Video = {
        thumbnailPublic,
        dislikeCount: 0,
        viewsCount: 0,
        isKids,
        uploadedBy,
        title,
        desc,
        videoPublic,
        comments: [],
      };

      const URI = `${BASE_URI}/insertOne`;
      const query = {
        collection: COLLECTION,
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: video,
      };
      options.body = JSON.stringify(query);
      const dataResponse = await fetch(URI, options);
      const { insertedId } = await dataResponse.json();
      response.headers.set("Access-Control-Allow-Origin", "*");

      if (dataResponse.ok) {
        response.status = 201;
        response.body = {
          success: true,
          data: video,
          insertedId,
        };
      } else {
        response.status = 500;
        response.body = {
          success: false,
          errmsg: "Can't add the video into the db",
        };
      }
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// !getVideos

const getVideos = async ({ response }: { response: any }) => {
  try {
    const URI = `${BASE_URI}/find`;
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const allVideos = await dataResponse.json();
    response.headers.set("Access-Control-Allow-Origin", "*");

    if (dataResponse.ok) {
      response.status = 200;
      response.body = {
        success: true,
        data: allVideos,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Can't fetch videos from db",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// !getVideo
const getVideo = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  const URI = `${BASE_URI}/findOne`;
  const query = {
    collection: COLLECTION,
    database: DATABASE,
    dataSource: DATA_SOURCE,
    filter: {
      videoPublic: params.id,
    },
  };
  options.body = JSON.stringify(query);
  const dataResponse = await fetch(URI, options);
  const video = await dataResponse.json();
  response.headers.set("Access-Control-Allow-Origin", "*");

  if (dataResponse.ok) {
    response.status = 200;
    response.body = {
      success: true,
      data: video,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No video found",
    };
  }
};

const searchVideo = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  
  const URI = `${BASE_URI}/aggregate`;
  const query = {
    collection: COLLECTION,
    database: DATABASE,
    dataSource: DATA_SOURCE,
    pipeline:[{
      $search:{
        index: "default",
        text: {
          query: params.id,
          path: {
            wildcard:"*"
          },
          fuzzy:{}
        }
      }
    },
    {
      $project: {
        _id: 0,
        thumbnailPublic: 1,
        dislikeCount: 1,
        viewsCount: 1,
        isKids: 1,
        uploadedBy: 1,
        title: 1,
        desc: 1,
        videoPublic: 1,
        comments: 1,

      },
    }
  ]
    
  };
  options.body = JSON.stringify(query);
  
  const dataResponse = await fetch(URI, options);
  const video = await dataResponse.json();
  
  response.headers.set("Access-Control-Allow-Origin", "*");

  if (dataResponse.ok) {
    response.status = 200;
    response.body = {
      success: true,
      data: video,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No video found",
    };
  }
};

export { addVideo, getVideo, getVideos, updateVideo ,searchVideo};
