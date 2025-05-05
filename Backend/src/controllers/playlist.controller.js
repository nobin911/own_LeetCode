/** @format */

import { db } from "../db/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;

    const userId = req.user.id;

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Playlist created Successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error Creating Playlist: ", error);
    res.status(500).json({
      error: "Failed to create Playlist",
    });
  }
};

export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "PlayList Problems fetched Successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error Fetching Playlist: ", error);
    res.status(500).json({
      error: "Failed to fetch Playlist",
    });
  }
};

export const getPlayListDetails = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "PlayList not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "PlayList fetched Successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error fetching Playlist: ", error);
    res.status(500).json({
      error: "Failed to Fetch PlayList",
    });
  }
};

export const addProblemToPlayList = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds || problemIds.length === 0)) {
      return res.status(400).json({
        error: "Invalid or missing ProblemIds",
      });
    }

    // create records for each problem in the playlist

    const problemsInPlaylist = await db.problemInPlayList.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error Adding problem in Playlist: ", error);
    res.status(500).json({
      error: "Faliled to adding problem in playlist",
    });
  }
};

export const deletePlayList = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    res.status(200).json({
      success: true,
      message: "PLaylist deleted successfully",
      deletePlayList,
    });
  } catch (error) {
    console.error("Error deleting playlist: ", error);
    res.status(500).json({
      error: "Failed to delete playlist",
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  const { problemIds } = req.body;
  const { playlistId } = req.params;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res.status(400).json({ error: "Invalid or missing problemsId" });
  }

  try {
    const deletedProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist: ", error);

    res.status(500).json({
      error: "Failed to remove problem from playlist",
    });
  }
};
