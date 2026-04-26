package com.musicplayer

import android.content.ContentResolver
import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.provider.MediaStore
import android.util.Log
import com.facebook.react.bridge.*

class MusicFilesModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MusicFiles"
    }

    @ReactMethod
    fun getAllAudioFiles(promise: Promise) {
        try {
            val contentResolver: ContentResolver = reactContext.contentResolver
            val uri: Uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI

            val projection = arrayOf(
                MediaStore.Audio.Media._ID,
                MediaStore.Audio.Media.TITLE,
                MediaStore.Audio.Media.ARTIST,
                MediaStore.Audio.Media.ALBUM,
                MediaStore.Audio.Media.DURATION,
                MediaStore.Audio.Media.DATA,
                MediaStore.Audio.Media.ALBUM_ID
            )

            val selection = "${MediaStore.Audio.Media.IS_MUSIC} != 0"

            val cursor: Cursor? = contentResolver.query(uri, projection, selection, null, null)

            val songs = WritableNativeArray()

            cursor?.use {
                val titleIndex = it.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
                val artistIndex = it.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
                val albumIndex = it.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
                val durationIndex = it.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
                val dataIndex = it.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA)
                val albumIdIndex = it.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID)

                while (it.moveToNext()) {
                    val song = WritableNativeMap()

                    val id = it.getLong(it.getColumnIndexOrThrow(MediaStore.Audio.Media._ID))
                    val title = it.getString(titleIndex) ?: "Unknown Title"
                    val artist = it.getString(artistIndex) ?: "Unknown Artist"
                    val album = it.getString(albumIndex) ?: "Unknown Album"
                    val duration = it.getLong(durationIndex)
                    val path = it.getString(dataIndex)
                    val albumId = it.getLong(albumIdIndex)

                    // Try to get album art
                    val artworkUri = Uri.parse("content://media/external/audio/albumart")
                    val coverUri = Uri.withAppendedPath(artworkUri, albumId.toString()).toString()

                    song.putString("id", id.toString())
                    song.putString("title", title)
                    song.putString("artist", artist)
                    song.putString("album", album)
                    song.putDouble("duration", duration.toDouble())
                    song.putString("url", path)
                    song.putString("cover", coverUri)

                    songs.pushMap(song)
                }
            }

            promise.resolve(songs)

        } catch (e: Exception) {
            Log.e("MusicFiles", "Error fetching songs", e)
            promise.reject("FETCH_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun deleteAudioFile(id: String, promise: Promise) {
        try {
            val contentResolver: ContentResolver = reactContext.contentResolver
            val uri: Uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
            val selection = "${MediaStore.Audio.Media._ID} = ?"
            val selectionArgs = arrayOf(id)

            val deletedRows = contentResolver.delete(uri, selection, selectionArgs)

            if (deletedRows > 0) {
                promise.resolve(true)
            } else {
                promise.reject("DELETE_FAILED", "Could not delete file with ID: $id")
            }
        } catch (e: Exception) {
            Log.e("MusicFiles", "Error deleting song", e)
            promise.reject("DELETE_ERROR", e.message, e)
        }
    }
}
