import re

# Read the file
with open('structs.hpp', 'r') as f:
    data = f.read()

# Step 1: Extract struct names and their bodies
# structs = re.findall(r'struct\s+(\w+)\s*\{\s*(.*?)\s*\};', data, re.DOTALL)

with open('_boost_structs.hpp', 'w') as f:

    # Write the header
    f.write('#include "structs.hpp"\n')
    f.write('#include <boost/hana.hpp>\n\n')
    f.write('namespace hana = boost::hana;\n')

    
    pattern = re.compile(r'\s([a-zA-Z][a-zA-Z0-9_]+)[;|,|{]')
    structs = data.split('struct ')[1:]
    struct_names = [struct.split('{')[0].strip() for struct in structs]
    struct_map = {} #{struct_name: struct for struct_name, struct in zip(struct_names, structs)}
    
    val_type_pattern = re.compile(r'(\w+)\s(.*?);') #r'([a-zA-Z][a-zA-Z0-9_]+)\s([a-zA-Z][a-zA-Z0-9_]+);')
    val_type_map = {}
    struct_val_map = {}
    val_type_map = {}
    for struct, struct_name in zip(structs, struct_names):
        struct_map[struct_name] = {}
        struct_val_types_ = val_type_pattern.findall(struct)

        var_type = struct_val_types_

        variables = {}
        for match in struct_val_types_:
            var_type = match[0]
            vars = match[1]
            _vars = vars.replace(' ', '')
            _vars = re.sub(r'\{[^}]*\}', '', _vars)

            variables.update({var: var_type for var in _vars.split(',')})
            struct_map[struct_name].update({var: var_type for var in _vars.split(',')})
            
        val_type_map.update(variables)
    # input(val_type_map)

    # Write the BOOST_HANA_ADAPT_STRUCT macros
    for s, struct in enumerate(structs):
        struct_name = struct_names[s]
        matches = pattern.findall(struct)
        members = list(set(matches))

        f.write(
            f'BOOST_HANA_ADAPT_STRUCT({struct_name}{", "+", ".join(members) if members else ""});\n')
        f.write(f'{struct_name} _{struct_name};\n\n')

    # Write the struct tuple
    f.write(
        f'auto structs = hana::make_tuple({", ".join([f"_{struct_name}" for struct_name in struct_names])});\n')

    # Write the process_struct function
    component_creations = '\n\t'.join(
        [f'if (struct_name == "{struct_name}") {{ registry.emplace_or_replace<{struct_name}>(entity); }}' for struct_name in struct_names])
    process_struct = f'void process_struct(string struct_name, nlohmann::json& value, entt::entity entity) {{{component_creations}\n}}'

    value_portion = ''.join([
        f'''
            // {struct_name}
            if (key == "{struct_name}" && registry.all_of<{struct_name}>(entity))
            {{
                {struct_name} &_{struct_name} = registry.get<{struct_name}>(entity);
                {
                    ''.join([
                            f"""
                if (_key == "{member}") // "{member}"
                {{
                    _{struct_name}.{member} = _value.get<{_type}>();
                }}
                            """
                            for member, _type in struct_map[struct_name].items()
                        ])
                }
            }}
        '''
        for struct_name in struct_names
    ])

    process_struct = f'''
if (value.is_object())
{{
    for (auto &___el : value.items())
    {{
        std::string _key = ___el.key();
        nlohmann::json _value = ___el.value();

        if (_value != "null") 
        {{
            {value_portion}
        }}
    }}
}}
    '''

    f.write(process_struct)
