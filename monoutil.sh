
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
"Enter" "Enter a directory" OFF 3>&1 1>&2 2>&3)

# Exit if the user pressed Cancel.
if [ $? -ne 0 ]; then
    exit 1
fi

if [ "$choice" == "Enter" ]; then
    # Prompt the user to enter a target directory path
    target_directory=$(whiptail --title "Input" --inputbox "Enter the target directory path:" 10 60 3>&1 1>&2 2>&3)
    # Exit if Cancel is pressed.
    if [ $? -ne 0 ]; then
        exit 1
    fi
    # Check if the directory exists
    if [ ! -d "$target_directory" ]; then
        # Ask the user if the directory should be created
        if (whiptail --title "Directory Not Found" --yesno "The directory does not exist. Do you want to create it?" 10 60); then
            mkdir -p "$target_directory"
        else
            exit 1
        fi
    fi
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

        echo $selected_dirs
        # Check if the user pressed Cancel
        if [ $? -ne 0 ]; then
            exit 1
        fi

        # Read the selection into an array
        read -a dirs_to_link <<< $selected_dirs

        # Iterate over the selected directories and create symlinks
        for dir in "${dirs_to_link[@]}"; do
            # Remove potential trailing slash from SOURCE_PATH if present
            SOURCE_PATH_CLEANED="${SOURCE_PATH%/}"
            # Use parameter expansion to ensure the directory name is unquoted
            dir_unquoted=${dir//\"}
            echo "Creating symlink for $dir_unquoted"
            echo "ln -s $SOURCE_PATH_CLEANED/$dir_unquoted $target_directory/$dir_unquoted"
            ln -s $SOURCE_PATH_CLEANED/$dir_unquoted $target_directory/$dir_unquoted
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