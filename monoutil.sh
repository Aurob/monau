
#!/bin/bash

source ~/.bashrc

# Ask the user for the top-level action (Add or Remove Links)
action=$(whiptail --title "Link Manager" --menu "Choose an action:" 15 60 2 \
"Add" "Add new links" \
"Remove" "Remove links" 3>&1 1>&2 2>&3)

# Exit if the user pressed Cancel.
if [ $? -ne 0 ]; then
    exit 1
fi

# Ask the user to select the current directory or enter a new one
choice=$(whiptail --title "Directory Selection" --radiolist \
"Choose directory:" 15 60 2 \
"Current" "Use current directory" ON \
"Select" "Select a directory" OFF 3>&1 1>&2 2>&3)

# Exit if the user pressed Cancel.
if [ $? -ne 0 ]; then
    exit 1
fi

if [ "$choice" == "Select" ]; then
    # List all directories in /var/www
    dirs_in_www=(/var/www/*/)
    # Create an array to hold the directory names
    dir_options=()
    for dir in "${dirs_in_www[@]}"; do
        dir_name=$(basename "$dir")
        dir_options+=("$dir_name" "" OFF)
    done
    
    # Prompt the user to select a directory
    target_directory=$(whiptail --title "Directory Selection" --radiolist \
    "Choose a target directory:" 15 60 ${#dir_options[@]} \
    "${dir_options[@]}" 3>&1 1>&2 2>&3)
    # Exit if Cancel is pressed.
    if [ $? -ne 0 ]; then
        exit 1
    fi
    # Prepend /var/www to the selected directory name
    target_directory="/var/www/$target_directory"
else
    # Use the current directory as the target directory
    target_directory=$(pwd)
fi

# Prompt the user to enter a source path if one is not already set
if [ -z "$SOURCE_PATH" ] || [ ! -d "$SOURCE_PATH" ]; then
    # Prompt the user to enter a source path
    SOURCE_PATH=$(whiptail --title "Source Path Input" --inputbox "Enter the source path:" 10 60 3>&1 1>&2 2>&3)
    # Exit if Cancel is pressed.
    if [ $? -ne 0 ]; then
        exit 1
    fi
    # Check if the path exists
    if [ ! -d "$SOURCE_PATH" ]; then
        whiptail --title "Error" --msgbox "The source path does not exist. Please try again." 10 60
        exit 1
    fi
    # Prompt to store the source path in the environment
    if (whiptail --title "Store Source Path" --yesno "Do you want to store the source path in the environment for future sessions?" 10 60); then
        echo "export SOURCE_PATH=\"$SOURCE_PATH\"" >> ~/.bashrc
        . ~/.bashrc
    fi
fi


# Proceed with Add or Remove action
case $action in
    Add)
        # Create an array to hold the checklist options
        checklist_options=()

        # Get the list of directories in the SOURCE_PATH
        for dir in "$SOURCE_PATH"/*/ ; do
            dir_name=$(basename "$dir")
            checklist_options+=("$dir_name" "" OFF)
        done

        # Prompt user to select directories to link
        selected_dirs=$(whiptail --title "Select Directories to Link" --checklist \
        "Choose directories to create symlinks in $target_directory:" 20 70 10 \
        "${checklist_options[@]}" 3>&1 1>&2 2>&3)

        # Check if the user pressed Cancel
        if [ $? -ne 0 ]; then
            exit 1
        fi

        # Read the selection into an array
        read -a dirs_to_link <<< $selected_dirs

        # Iterate over the selected directories and create symlinks
        for dir in "${dirs_to_link[@]}"; do
            # Use parameter expansion to ensure the directory name is unquoted
            dir_unquoted=${dir//\"}
            # Skip if the directory already exists in the target directory
            if [ -d "$target_directory/$dir_unquoted" ]; then
                echo "Directory $dir_unquoted already exists in the target directory. Skipping..."
                continue
            fi
            # Remove potential trailing slash from SOURCE_PATH if present
            SOURCE_PATH_CLEANED="${SOURCE_PATH%/}"
            echo "Creating symlink for $dir_unquoted"
            echo "ln -s $SOURCE_PATH_CLEANED/$dir_unquoted $target_directory/$dir_unquoted"
            ln -s $SOURCE_PATH_CLEANED/$dir_unquoted $target_directory/$dir_unquoted
            # Check if sitemap.html exists in the target directory, if not, copy it from the source
            if [ ! -f "$target_directory/sitemap.html" ]; then
                echo "sitemap.html not found in target. Creating symlink from source..."
                ln -s "$SOURCE_PATH_CLEANED/sitemap.html" "$target_directory/sitemap.html"
            fi
            # After creating the symlink, run sitemap.py to update the sitemap
            echo "Updating sitemap..."
            python3 sitemap.py $target_directory
        done
        ;;

    Remove)
        # Create an array to hold the checklist options
        checklist_options=()

        # Get the list of directories in the target directory
        for dir in "$target_directory"/*/ ; do
            dir_name=$(basename "$dir")
            checklist_options+=("$dir_name" "" OFF)
        done

        # Prompt user to select directories to remove
        selected_dirs=$(whiptail --title "Select Directories to Remove" --checklist \
        "Choose directories to remove from $target_directory:" 20 70 10 \
        "${checklist_options[@]}" 3>&1 1>&2 2>&3)

        # Check if the user pressed Cancel
        if [ $? -ne 0 ]; then
            exit 1
        fi

        # Read the selection into an array
        read -a dirs_to_remove <<< $selected_dirs

        # Iterate over the selected directories and remove symlinks
        for dir in "${dirs_to_remove[@]}"; do
            # Use parameter expansion to ensure the directory name is unquoted
            dir_unquoted=${dir//\"}
            echo "Removing symlink for $dir_unquoted"
            echo "rm $target_directory/$dir_unquoted"
            rm $target_directory/$dir_unquoted
        done
        ;;
        
esac